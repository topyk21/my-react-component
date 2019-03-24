import SimpleMuiGrid from 'src/components/grid/SimpleMuiGrid'
import InfiniteVirtualGrid from 'src/components/grid/InfiniteVirtualGrid'
import InfiniteApiGrid, {
  IContProps as InfiniteApiGridProps,
} from 'src/components/grid/infinite-api-grid/InfiniteApiGridContainer'

import 'src/components/grid/SimpleMuiGrid.scss'
import 'src/components/grid/InfiniteVirtualGrid.scss'
import 'src/components/grid/infinite-api-grid/InfiniteApiGrid.scss'
import 'react-virtualized/styles.css'

export { InfiniteApiGrid, InfiniteApiGridProps, SimpleMuiGrid, InfiniteVirtualGrid }

export default { InfiniteApiGrid, SimpleMuiGrid, InfiniteVirtualGrid }
