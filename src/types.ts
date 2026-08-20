export type ElementType = 
  | 'labelapp' 
  | 'label' 
  | 'divider' 
  | 'tooltip' 
  | 'input_int' 
  | 'input_string' 
  | 'slider' 
  | 'dropdown' 
  | 'item_picker' 
  | 'tile_select' 
  | 'simple_display' 
  | 'button' 
  | 'toggle' 
  | 'toggle_button' 
  | 'dialog';

export interface ModuleElement {
  id: string; // Internal React ID
  type: ElementType;
  text?: string;
  icon?: string;
  alias?: string;
  support_text?: string;
  default?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  value?: string; // e.g. "[\"A\",\"B\"]" for dropdown
  item?: string;
  count?: number;
  description?: string;
  setup?: boolean;
  expandable?: boolean;
  always_expand?: boolean;
  background?: boolean;
  list_child?: ModuleElement[];
  menu?: ModuleElement[];
  fill?: boolean;
  readonly?: boolean;
}

export interface ModuleConfig {
  sub_name: string;
  icon: string;
  menu: ModuleElement[];
}
