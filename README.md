#My(Hong's) react component
This Project based on create-react-app(CRA) and Webpack v4.

---

### What you need to do to understand this source

1. Basic
   - Es6 JS, css, html basic
   - Class in javascript and problem
   - What is immutability? And why need immutability?
2. React with Typescript
3. Presentational & Container component pattern
4. What is react-router?
5. Dynamic bundle import by React-Loadable
6. **Redux**
7. Ducks pattern for redux
8. Promise and redux-saga

---

### Project Directory structure

- **build/**
  - Run `npm run build`, all outputs are put here.
  - This directory is excluded from git repo.(See .gitignore)
- **config/**
  - Env. & Paths variable, development and proudction webpack config are put here
  - If you don't know about webpack, **don't touch this directory!**
- **public/**
  - When you do development & production build, the basic html files are here.
- **scripts/**
  - When you run `npm run start` `npm run build` `npm run test`, those scripts files will be execute. They refer to their own scripts and webpack settings in the config directory.
- **src/**
  - **anti/**
  - **atoms/**
  - **css/**
  - **layout/**
  - **molecules/**
  - **organisms/**
  - **layout/**
  - **pages**
  - **templates**
  - **utils**

- .prettierrc
  - This defines beautify settings. You can use beautify `alt+shift+f` in VsCode. It's very helpful, you should press hotkeys(`alt+shift+f`) after you've written all code.
- tsconfig.json ~ tslint.json

---

###Source Convention and some tips...

- The directory should consist of lowercase letters and hyphens.

```
(O)pages\search-options\..
(O)components\grid\..
(X)Pages\SearchOptions\..
(X)Components\Grid\..
```

- Use PascalCasing for components file name and components declaration.
- Use camelCasing for variables and function param
- Use uppercase and underscore for constants.

```java
class Counter extends React.Component<{}, { number: number }> {};

const ROW_HEIGHT = 24; // Fixed value that never changes

interface IBoardListProps {
    rows: object[];
    cols: Array<{ key: string; value: string; width: number }>;
    nextPageLoading: boolean;
    loadMoreRows: () => Promise<any>;
    onClickRow?: (info: RowMouseEventHandlerParams) => void;
};
```

- Use lowercase and hyphen and underscore for className(CSS). If you need to distinguish the components within each component, you have to add two underscores. You should separate the CSS properties into different files.

```css
.simple-mui-grid {
  overflow: auto;
  height: 100%;

  .simple-mui-grid__header {
    .simple-mui-grid__cell {
      top: 0;
      position: sticky;
      font-size: medium;
      @include secondary-color;
    }
  }

  .simple-mui-grid__body {
    cursor: pointer;
    .simple-mui-grid__cell {
      & > div {
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
```

- Think like React. Always think for better way. If the page you are building can be divided into smaller units, devide it. And make it flexible so you can recycle it elsewhere. For example, imagine that you are building a free board. The free board consists of 'grid' and 'search window'. So you have to create a flexible grid and search box that can support either 'free' or 'announcement' or 'information' before create a free board.
- If you make complex components, you can use View-container pattern. Container does not include any view-related code. Container includes the code associated with the action and user interaction.

```java
(X)
class BoardContainer extends React.Component<IContProps, IContState> {
    ...
    render() {
        return (
            <div className="board_wrap">
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    onEscapeKeyDown={this.onCloseBoardForm}
                    onBackdropClick={this.onCloseBoardForm}
                    open={this.state.mode === 'C' ||
                        this.state.mode === 'U' ||
                        this.state.mode === 'R'}
                />
                <BoardForm
                    mode={this.state.mode}
                    boardData={this.state.board}
                    onChangeBoardData={this.onChangeBoardItem}
                    onEditorTextChange={this.onEditorTextChange}
                    onDeleteBoardData={this.onDeleteBoardData}
                    onUpdateBoardData={this.onUpdateBoardData}
                    onChangeUpdatePage={this.onChangeUpdatePage}
                    onCloseBoardForm={this.onCloseBoardForm}
                />
            </div>
        );
    }
    ...
}
(O)
class BoardContainer extends React.Component<IContProps, IContState> {
    ...
    render() {
        return (
            <BoardForm
                // Board form props...
                ...
                // Dialog props...
                ...
            />
        )
    }
    ...
}
```

- You must have a clear understanding of the concept of Immutable.

---
About CRA 3

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
