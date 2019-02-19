import { IMenuData } from 'src/components/menu/types'
export const menuData: IMenuData[] = [
  {
    id: '1',
    label: 'Test1',
    parentId: '-1',
    subMenuItem: [
      {
        id: '11',
        label: 'Test1-1',
        bindingPath: 'test/Test1',
        parentId: '1',
        subMenuItem: [
          {
            id: '111',
            label: 'Test1-1-1',
            bindingPath: 'test/Test2',
            parentId: '1',
            subMenuItem: [
              {
                id: '1111',
                label: 'Test1-1-1-1',
                bindingPath: 'test/Test3',
                parentId: '111',
              },
            ],
          },
        ],
      },
      {
        id: '12',
        label: 'Test1-2',
        bindingPath: 'test/Counter',
        parentId: '1',
      },
      {
        id: '13',
        label: 'Test1-3',
        bindingPath: 'test/Test2',
        parentId: '1',
      },
      {
        id: '14',
        label: 'Test1-4',
        bindingPath: 'test/Test3',
        parentId: '1',
      },
      {
        id: '15',
        label: 'Test1-5',
        bindingPath: 'test/Test4',
        parentId: '1',
      },
      {
        id: '16',
        label: 'Test1-6',
        bindingPath: 'test/Test5',
        parentId: '1',
      },
      {
        id: '17',
        label: 'Test1-7',
        bindingPath: 'test/Test6',
        parentId: '1',
      },
      {
        id: '18',
        label: 'Test1-8',
        bindingPath: 'test/Test1',
        parentId: '1',
      },
      {
        id: '19',
        label: 'Test1-9',
        bindingPath: 'WaitingWindow',
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    label: 'Test2',
    parentId: '-1',
    subMenuItem: [
      {
        id: '21',
        label: 'Test2-1',
        parentId: '2',
      },
    ],
  },
  {
    id: '3',
    label: 'Test3-1',
    parentId: '-1',
    subMenuItem: [
      {
        id: '111111',
        label: 'Test3-1-1',
        bindingPath: 'test/Test2',
        parentId: '3',
        subMenuItem: [
          {
            id: '1111222',
            label: 'Test3-1-1-1',
            bindingPath: 'test/Test3',
            parentId: '111111',
          },
        ],
      },
    ],
  },
  { id: '4', label: 'TEST4', parentId: '-1' },
  { id: '5', label: 'TEST5', parentId: '-1' },
  { id: '6', label: 'TEST6', parentId: '-1' },
  { id: '7', label: 'TEST7', parentId: '-1' },
  { id: '8', label: 'TEST8', parentId: '-1' },
  { id: '9', label: 'TEST9', parentId: '-1' },
]
