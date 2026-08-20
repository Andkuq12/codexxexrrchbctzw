import { ModuleConfig, ModuleElement } from "../types";

export function generateLuaCode(config: ModuleConfig): string {
  let jsonStr = generateJSON(config);

  return `math.randomseed(os.time())
local randomInt = math.random(10000, 99999)
local ri = tostring(randomInt)

local function log(msg)
    LogToConsole("[Module Example] " .. msg)
end

-- Tabel state sederhana untuk menyimpan semua nilai dari module
local State = {
    number_value    = 100,
    text_value      = "",
    delay_value     = 250,
    mode_index      = 0,
    picked_item_id  = 0,
    feature_enabled = true,
    min_value       = 10,
    max_value       = 80,
    selected_tiles  = {},
    item_list       = { "Item A", "Item B", "Item C" },
}

local function updateStatus(text)
    pcall(function()
        editValue("status_label!" .. ri, "Status: " .. text)
    end)
    log(text)
end

-- simple_display butuh array JSON dari State.item_list, dibangun ulang
-- setiap kali module di-render supaya selalu sinkron dengan data terbaru.
local function buildItemListJSON()
    local parts = {}
    for _, v in ipairs(State.item_list) do
        parts[#parts + 1] = '"' .. v .. '"'
    end
    if #parts == 0 then parts = { '"Kosong"' } end
    return "[" .. table.concat(parts, ",") .. "]"
end

-- Seluruh moduleJSON dibungkus jadi fungsi (bukan variabel statis) supaya
-- bisa dipanggil ulang (addIntoModule lagi) setelah State berubah, misalnya
-- setelah item di simple_display dihapus.
local function buildModuleJSON()
    return [[
${jsonStr}
]]
end

addIntoModule(buildModuleJSON())

-- ================================================================
-- onValue: menangani semua vtype resmi (0, 1, 2, 5, 6, 7)
-- ================================================================
addHook(function(vtype, alias, value)
    local base, id = alias:match("^(.-)!(%d+)$")
    if not base or tostring(id) ~= ri then return false end

    -- vtype 0 = Toggle -> toggle, toggle_button, button
    if vtype == 0 then
        if base == "run_action" and value == false then
            updateStatus("Tombol 'Jalankan Aksi' ditekan")
            return true
        end
        if base == "feature_enabled" then
            State.feature_enabled = value
            updateStatus("Fitur X: " .. (value and "Aktif" or "Nonaktif"))
            return true
        end
        if base == "toggle_start" then
            updateStatus(value and "Started" or "Stopped")
            return true
        end
    end

    -- vtype 1 = Slider -> slider, input_int, dropdown
    if vtype == 1 then
        if base == "number_value" then
            State.number_value = tonumber(value) or State.number_value
            updateStatus("Nilai angka diubah: " .. State.number_value)
            return true
        end
        if base == "delay_value" then
            State.delay_value = tonumber(value) or State.delay_value
            updateStatus("Delay diubah: " .. State.delay_value .. "ms")
            return true
        end
        if base == "mode_index" then
            State.mode_index = tonumber(value) or 0
            local modes = { "Mode A", "Mode B", "Mode C" }
            updateStatus("Mode dipilih: " .. (modes[State.mode_index + 1] or "?"))
            return true
        end
        if base == "min_value" then
            State.min_value = tonumber(value) or State.min_value
            return true
        end
        if base == "max_value" then
            State.max_value = tonumber(value) or State.max_value
            return true
        end
    end

    -- vtype 2 = Item_Picker
    if vtype == 2 then
        if base == "picked_item" then
            local itemId = growtopia.getItemID(value)
            if itemId and itemId > 0 then
                State.picked_item_id = itemId
                updateStatus("Item dipilih: " .. value .. " (ID: " .. itemId .. ")")
            end
            return true
        end
    end

    -- vtype 5 = String -> input_string
    if vtype == 5 then
        if base == "text_value" then
            State.text_value = tostring(value)
            updateStatus("Teks diubah: " .. State.text_value)
            return true
        end
    end

    -- vtype 6 = Select Tile -> tile_select
    if vtype == 6 then
        if base == "tile_picker" then
            local p = GetLocal()
            local originX = p and (p.posX // 32) or 0
            local originY = p and (p.posY // 32) or 0

            State.selected_tiles = {}
            if type(value) == "table" then
                local seen = {}
                for _, tile in pairs(value) do
                    if type(tile) == "table" and tile.x ~= nil and tile.y ~= nil then
                        local absX = originX + tile.x
                        local absY = originY + tile.y
                        local key  = absX .. "," .. absY
                        if not seen[key] then
                            seen[key] = true
                            table.insert(State.selected_tiles, { x = absX, y = absY })
                        end
                    end
                end
                table.sort(State.selected_tiles, function(a, b)
                    if a.y == b.y then return a.x < b.x end
                    return a.y < b.y
                end)
            end
            updateStatus(#State.selected_tiles .. " tile dipilih")
            return true
        end
    end

    -- vtype 7 = Display List -> simple_display
    if vtype == 7 then
        if base == "item_list" then
            local idx = nil
            if type(value) == "number" then
                idx = value + 1
            elseif type(value) == "string" then
                for i, v in ipairs(State.item_list) do
                    if v == value then idx = i; break end
                end
            end
            if idx and State.item_list[idx] then
                local removed = table.remove(State.item_list, idx)
                updateStatus("Item dihapus: " .. removed)
                addIntoModule(buildModuleJSON())
            end
            return true
        end
    end

    return false
end, "onValue")

updateStatus("Module Example loaded")`;
}

function generateJSON(config: ModuleConfig): string {
  const processElements = (elements: ModuleElement[]): any[] => {
    return elements.map(el => {
      const result: any = { type: el.type };
      
      if (el.text !== undefined) result.text = el.text;
      if (el.icon !== undefined) result.icon = el.icon;
      
      if (el.alias !== undefined) result.alias = el.alias + "!%%RI_PLACEHOLDER%%";
      
      if (el.support_text !== undefined) result.support_text = el.support_text;
      
      if (el.default !== undefined) {
        if (el.alias === 'item_list') {
            result.default = "%%ITEM_LIST%%";
        } else if (el.alias === 'number_value') {
            result.default = "%%NUM_VAL%%";
        } else if (el.alias === 'text_value') {
            result.default = "%%TEXT_VAL%%";
        } else if (el.alias === 'delay_value') {
            result.default = "%%DELAY_VAL%%";
        } else if (el.alias === 'mode_index') {
            result.default = "%%MODE_VAL%%";
        } else if (el.alias === 'feature_enabled') {
            result.default = "%%FEATURE_VAL%%";
        } else if (el.alias === 'min_value') {
            result.default = "%%MIN_VAL%%";
        } else if (el.alias === 'max_value') {
            result.default = "%%MAX_VAL%%";
        } else {
            result.default = el.default;
        }
      }

      if (el.placeholder !== undefined) result.placeholder = el.placeholder;
      if (el.min !== undefined) result.min = el.min;
      if (el.max !== undefined) result.max = el.max;
      
      if (el.value !== undefined) {
          if (el.type === 'dropdown' || el.type === 'simple_display') {
             try {
                 JSON.parse(el.value);
                 result.value = el.value;
             } catch(e) {
                 result.value = el.value;
             }
          } else {
             result.value = el.value;
          }
      }

      if (el.item !== undefined) result.item = el.item;
      if (el.count !== undefined) result.count = el.count;
      if (el.description !== undefined) result.description = el.description;
      if (el.setup !== undefined) result.setup = el.setup;
      if (el.expandable !== undefined) result.expandable = el.expandable;
      if (el.always_expand !== undefined) result.always_expand = el.always_expand;
      if (el.background !== undefined) result.background = el.background;
      if (el.readonly !== undefined) result.readonly = el.readonly;
      
      if (el.list_child && el.list_child.length > 0) {
        result.list_child = processElements(el.list_child);
      }
      if (el.menu && el.menu.length > 0) {
        result.menu = processElements(el.menu);
      }

      return result;
    });
  };

  const finalObj = {
    sub_name: config.sub_name,
    icon: config.icon,
    menu: processElements(config.menu)
  };

  let jsonString = JSON.stringify(finalObj, null, 4);
  
  // Replace the placeholder with the Lua variable concatenation
  jsonString = jsonString.replace(/!%%RI_PLACEHOLDER%%/g, `!]] .. ri .. [[`);
  jsonString = jsonString.replace(/"%%ITEM_LIST%%"/g, `]] .. buildItemListJSON() .. [[`);
  jsonString = jsonString.replace(/"%%NUM_VAL%%"/g, `]] .. State.number_value .. [[`);
  jsonString = jsonString.replace(/"%%TEXT_VAL%%"/g, `"]] .. State.text_value .. [["`);
  jsonString = jsonString.replace(/"%%DELAY_VAL%%"/g, `]] .. State.delay_value .. [[`);
  jsonString = jsonString.replace(/"%%MODE_VAL%%"/g, `]] .. State.mode_index .. [[`);
  jsonString = jsonString.replace(/"%%FEATURE_VAL%%"/g, `]] .. tostring(State.feature_enabled) .. [[`);
  jsonString = jsonString.replace(/"%%MIN_VAL%%"/g, `]] .. State.min_value .. [[`);
  jsonString = jsonString.replace(/"%%MAX_VAL%%"/g, `]] .. State.max_value .. [[`);
  
  return jsonString;
}
