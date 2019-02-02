export interface IMenuData {
  id: string
  label: string
  parentId: string
  bindingPath?: string
  subMenuItem?: IMenuData[]
}
export interface IMenuItem {
  id: string
  label: string
  parentId: string
  bindingPath?: string
}
