import { Breadcrumbs, Link, List, Typography } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";

type Board = {
  name: string;
  key: string;
  children: string[];
  parents: string[];
};

const dataset: Board[] = [
  {
    name: "board1",
    key: "board1",
    children: ["board2", "board6"],
    parents: [],
  },
  {
    name: "board2",
    key: "board2",
    children: ["board3", "board7"],
    parents: ["board1"],
  },
  {
    name: "board3",
    key: "board3",
    children: ["board4"],
    parents: ["board2", "board6"],
  },
  {
    name: "board4",
    key: "board4",
    children: ["board5"],
    parents: ["board3"],
  },
  {
    name: "board5",
    key: "board5",
    children: [],
    parents: ["board4"],
  },
  {
    name: "board6",
    key: "board6",
    children: ["board3", "board7", "board8"],
    parents: ["board1"],
  },
  {
    name: "board7",
    key: "board7",
    children: ["board9", "board10"],
    parents: ["board2", "board6"],
  },
  {
    name: "board8",
    key: "board8",
    children: [],
    parents: ["board6"],
  },
  {
    name: "board9",
    key: "board9",
    children: [],
    parents: ["board7"],
  },
  {
    name: "board10",
    key: "board10",
    children: [],
    parents: ["board7"],
  },
];

function createRouteComponentsFromDataset(dataset: Board[]) {
  const findBoardByKey = (key: string) =>
    dataset.find((board) => board.key === key);

  const routes: JSX.Element[] = [];

  function createRouteFor(board: Board, parentPath = "") {
    const currentPath = `${parentPath}/${board.key}`;

    if (routes.some((r) => r.props.path === currentPath)) return;

    routes.push(
      <Route
        key={board.key}
        path={currentPath}
        element={<Navigation board={board} currentPath={currentPath} />}
      />
    );

    // Recursively create routes for children
    board.children.forEach((childKey) => {
      const childBoard = findBoardByKey(childKey);
      if (childBoard) {
        childBoard.parents.forEach((parentKey) => {
          createRouteFor(childBoard, `${parentPath}/${parentKey}`);
        });
      }
    });
  }

  dataset.forEach((board) => createRouteFor(board));

  console.log(routes.map((r) => ({ boardName: r.key, path: r.props.path })));
  return routes;
}

function Navigation(props: Readonly<{ board: Board; currentPath: string }>) {
  const { board, currentPath } = props;

  const breadcrumbs = currentPath.split("/");

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        {(() => {
          let path = "/";

          return breadcrumbs.map((breadcrumb, index) => {
            if (index > 0) {
              path += `${breadcrumb}/`;
            }

            return (
              <Link key={breadcrumb} href={path}>
                {breadcrumb || "home"}
              </Link>
            );
          });
        })()}
      </Breadcrumbs>

      <Typography>
        Board's children: {board.children.length === 0 && "-"}
      </Typography>
      {board.children.length > 0 && (
        <List>
          {board.children.map((c) => (
            <Link key={c} href={currentPath + `/${c}`}>
              <Typography>{c}</Typography>
            </Link>
          ))}
        </List>
      )}
    </>
  );
}

function App() {
  const routeComponents = createRouteComponentsFromDataset(dataset);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Home</h1>
              <h2>Boards</h2>
              <List>
                {dataset.map(({ key }) => (
                  <div key={key}>
                    <Link style={{ display: "inline-block" }} href={`/${key}`}>
                      <Typography>{key}</Typography>
                    </Link>{" "}
                  </div>
                ))}
              </List>
            </>
          }
        ></Route>
        {routeComponents}
        <Route path="*" element={<h1>Not Found</h1>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
