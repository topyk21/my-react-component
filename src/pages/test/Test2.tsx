import * as React from 'react'

import { Selector, ApiSelector } from 'src/components/selector'
import FileUploader from 'src/components/file-uploader'
class Test2 extends React.Component<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <div>TEST PAGE 2</div>
        <ApiSelector
          multiple
          api="https://api.jikan.moe/v3/search/anime?q=Fate"
          queryKey="q"
          dataKey="results"
          fieldKey={['mal_id', 'title']}
          fetchMode="load-once"
          formLabel="Local data fetch"
        />
        <ApiSelector
          multiple
          api="https://api.jikan.moe/v3/search/anime"
          queryKey="q"
          dataKey="results"
          fieldKey={['mal_id', 'title']}
          fetchMode="lazy-search"
          maxSelectedCnt={10}
          formLabel="Local data fetch"
        />
        <Selector multiple formLabel="No data test" maxSelectedCnt={10} data={[]} />
        <FileUploader multiple api="" allowedExtension={['jpg', 'png']} />
      </React.Fragment>
    )
  }
}

export default Test2
