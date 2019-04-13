export type ThemeCode = 'light' | 'dark'
export type LayoutDirection = 'column' | 'row'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
