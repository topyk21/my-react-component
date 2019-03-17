import * as React from 'react'
import Board from 'src/components/board'

const Test3: React.SFC<{}> = () => (
  <Board
    api="https://api.jikan.moe/v3/search/anime"
    cols={[
      { key: 'mal_id', value: 'ID', width: 60 },
      { key: 'title', value: 'Title', width: 210 },
      { key: 'type', value: 'Type', width: 60 },
      { key: 'score', value: 'Score', width: 60 },
    ]}
    dataKey="results"
    dataUniqueKey="mal_id"
    lastPageKey="last_page"
    searchOptions={[{ key: 'q', value: 'Anime title' }]}
  />
)

export default Test3
