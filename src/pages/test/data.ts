import { IMenuData } from 'src/components/menu/types'
export const menuData: IMenuData[] = [
  {
    id: '1',
    label: '기준 정보',
    parentId: '-1',
    subMenuItem: [
      {
        id: '11',
        label: 'Test1 Page',
        bindingPath: 'test/Test1',
        parentId: '1',
        subMenuItem: [
          {
            id: '111',
            label: 'Test2 Page',
            bindingPath: 'test/Test2',
            parentId: '1',
            subMenuItem: [
              {
                id: '1111',
                label: 'Test3 Page',
                bindingPath: 'test/Test3',
                parentId: '111',
              },
            ],
          },
        ],
      },
      {
        id: '12',
        label: '공정 기준 정보',
        bindingPath: 'test/Counter',
        parentId: '1',
      },
      {
        id: '13',
        label: 'Route flow setup',
        bindingPath: 'test/Test2',
        parentId: '1',
      },
      {
        id: '14',
        label: 'User code',
        bindingPath: 'test/Test3',
        parentId: '1',
      },
      {
        id: '15',
        label: 'System code',
        bindingPath: 'test/Test4',
        parentId: '1',
      },
      {
        id: '16',
        label: 'Sap code 기준 정보',
        bindingPath: 'test/Test5',
        parentId: '1',
      },
      {
        id: '17',
        label: '제품 정보 통합 관리',
        bindingPath: 'test/Test6',
        parentId: '1',
      },
      {
        id: '18',
        label: 'Mailing 관리',
        bindingPath: 'test/Test1',
        parentId: '1',
      },
      {
        id: '19',
        label: '단축키 설정',
        bindingPath: 'WaitingWindow',
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    label: 'System 관리',
    parentId: '-1',
    subMenuItem: [
      {
        id: '21',
        label: '사용자 정보 관리',
        parentId: '2',
        subMenuItem: [
          { id: '22', label: '메뉴', parentId: '2' },
          { id: '221', label: 'Main 메뉴', parentId: '2' },
          { id: '222', label: 'Sub 메뉴', parentId: '2' },
          { id: '223', label: '메인 메뉴', parentId: '2' },
          { id: '224', label: '보조 메뉴', parentId: '2' },
        ],
      },
      { id: '23', label: 'Role 그룹 기준정보', parentId: '2' },
      { id: '24', label: 'Property 관리', parentId: '2' },
      { id: '25', label: 'Map Symbol Color 관리', parentId: '2' },
      { id: '26', label: 'Calendar 관리', parentId: '2' },
      { id: '27', label: '언어 관리', parentId: '2' },
      { id: '28', label: '알람 이력 조회', parentId: '2' },
      { id: '29', label: '쿼리 로그 조회', parentId: '2' },
    ],
  },
  {
    id: '3',
    label: '계획',
    parentId: '-1',
    subMenuItem: [
      {
        id: '111111',
        label: 'Test2 Page',
        bindingPath: 'test/Test2',
        parentId: '3',
        subMenuItem: [
          {
            id: '1111222',
            label: 'Test3 Page',
            bindingPath: 'test/Test3',
            parentId: '111111',
          },
        ],
      },
    ],
  },
  { id: '4', label: '비용', parentId: '-1' },
  { id: '5', label: '재공', parentId: '-1' },
  { id: '6', label: 'BOM', parentId: '-1' },
  { id: '7', label: '발주', parentId: '-1' },
  { id: '8', label: '납품', parentId: '-1' },
  { id: '9', label: 'IQC', parentId: '-1' },
]
