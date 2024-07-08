import { Breadcrumbs, Link, List, Typography } from "@mui/material";
import { Route, Routes, BrowserRouter, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

const findBoardByKey = (key: string) =>
  dataset.find((board) => board.key === key);

function Page404() {
  return <h1>404 Not Found</h1>;
}

function Navigation() {
  const { path } = useParams();

  if (!path) {
    return <Page404 />;
  }

  const breadcrumbs = path.split("--");
  const currentboardId = [...breadcrumbs].pop();
  const currentBoard = currentboardId && findBoardByKey(currentboardId);

  // TODO add check for parents to double check the tree

  if (!currentBoard) {
    return <Page404 />;
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">home</Link>
        {(() => {
          let path = "/";

          return breadcrumbs.map((breadcrumb, index) => {
            if (path !== "/") {
              path += "--";
            }

            if (index !== breadcrumb.length - 1) {
              path += `${breadcrumb}`;
            }

            return (
              <Link key={breadcrumb} href={"/data" + path}>
                {breadcrumb}
              </Link>
            );
          });
        })()}
      </Breadcrumbs>
      <Typography>
        Board's children: {currentBoard.children.length === 0 && "-"}
      </Typography>
      {currentBoard.children.length > 0 && (
        <List>
          {currentBoard.children.map((c) => (
            <Link key={c} href={path + `--${c}`}>
              <Typography>{c}</Typography>
            </Link>
          ))}
        </List>
      )}
    </>
  );
}
function Wrapper() {
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
                    <Link
                      style={{ display: "inline-block" }}
                      href={`/data/${key}`}
                    >
                      <Typography>{key}</Typography>
                    </Link>{" "}
                  </div>
                ))}
              </List>

              <h2>Dataset</h2>
              <TableContainer sx={{ maxWidth: "900px" }} component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Board key
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Board name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Children
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Parents</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataset.map((b) => (
                      <TableRow key={b.key}>
                        <TableCell component="th" scope="row">
                          {b.key}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {b.name}
                        </TableCell>
                        <TableCell>{b.children.join(", ") || "-"}</TableCell>
                        <TableCell>{b.parents.join(", ") || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          }
        ></Route>
        <Route path="/data/:path" element={<Navigation />}></Route>
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return <Wrapper />;
}

export default App;
