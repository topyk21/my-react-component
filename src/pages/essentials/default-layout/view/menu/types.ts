export interface IMenuData {
  id: string
  value: string
  parentId: string
  bindingPath?: string
  subMenuItem?: IMenuData[]
}
export interface IMenuItem {
  id: string
  value: string
  parentId: string
  bindingPath?: string
}
