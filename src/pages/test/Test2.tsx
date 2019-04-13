import * as React from 'react'

import { Selector, SelectorWithAjax } from 'src/components/selector'
import FileUploader from 'src/components/file-uploader'
class Test2 extends React.Component<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <div>TEST PAGE 2</div>
        <div style={{ flex: '1 1 auto' }}>
          <SelectorWithAjax
            api="https://api.jikan.moe/v3/search/anime?q=Fate"
            dataKey="results"
            fetchMode="load-once"
            multiple
            searchListProps={{ field: ['mal_id', 'title'] }}
            selectorFormTextFieldProps={{ label: 'Local data fetch' }}
          />
          <SelectorWithAjax
            api="https://api.jikan.moe/v3/search/anime?q=Fate"
            dataKey="results"
            fetchMode="refresh-always"
            multiple
            maxSelectedCount={10}
            searchListProps={{ field: ['mal_id', 'title'] }}
            selectorFormTextFieldProps={{ label: 'Local data fetch' }}
          />
          <SelectorWithAjax
            api="https://api.jikan.moe/v3/search/anime"
            dataKey="results"
            fetchMode="lazy-search"
            multiple={false}
            maxSelectedCount={10}
            queryKey="q"
            searchListProps={{ field: ['mal_id', 'title'] }}
            selectorFormTextFieldProps={{ label: 'Local data fetch' }}
          />
          <Selector
            data={[]}
            multiple
            maxSelectedCount={10}
            searchListProps={{ field: ['id', 'name'] }}
            selectorFormProps={{ textFieldProps: { label: 'No data test' } }}
          />
          <FileUploader multiple api="" allowedExtension={['jpg', 'png']} />{' '}
        </div>
      </React.Fragment>
    )
  }
}

export default Test2
