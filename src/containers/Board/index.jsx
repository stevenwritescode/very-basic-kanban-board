//react imports
import React from "react";
import { withStyles } from "@material-ui/styles";
import { Button, Grid, IconButton, Paper, Typography as Text } from "@material-ui/core";
import KanbanCard from "../../components/KanbanCard";
import { Add, Edit, Delete } from "@material-ui/icons";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 25,
  },
  columnHeader: {
    color: "#FFF",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  arrow: {
    flex: "0 1 auto",
  },
  cardContent: {
    padding: 8,
    flex: "1 1 auto",
  },
  editButton: {
    position: "absolute",
    top: 0,
    right: 10,
  },
});

class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          id: 0,
          name: "To Do",
          headerColor: "#f44336",
          cards: [],
        },
        {
          id: 1,
          name: "In Development",
          headerColor: "#9c27b0",
          cards: [],
        },
        {
          id: 2,
          name: "In Test",
          headerColor: "#3f51b5",
          cards: [],
        },
        {
          id: 3,
          name: "Done",
          headerColor: "#8bc34a",
          cards: [],
        },
      ],
    };
  }

  componentDidMount() {
    const columns = localStorage.getItem("kanbanBoard");
    if (columns) {
      console.log(columns);
      this.setState({ columns });
    }
  }

  componentWillUnmount() {
    const { columns } = this.state;
    localStorage.setItem("kanbanBoard", columns);
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  handlers = {
    handleAddColumn: () => {
      const { columns } = this.state;
      const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16);
      const newColumnName = window.prompt("Column Name:", `Column ${columns.length + 1}`);
      const newColumnColor = window.prompt("Column Background Color (Hexadecimal):", randomHex);
      const newColumn = {
        id: columns.length,
        name: newColumnName,
        headerColor: newColumnColor,
        cards: [],
      };

      if (newColumnName && newColumnName.length > 0) {
        columns[columns.length] = newColumn;
        this.setState({ columns });
      }
    },

    handleEditColumn: index => {
      const { columns } = this.state;
      const newColumnName = window.prompt("Column Name:", columns[index].name);
      const newColumnColor = window.prompt("Column Background Color (Hexadecimal):", columns[index].headerColor);
      if (newColumnName && newColumnName.length > 0) {
        columns[index].name = newColumnName;
        columns[index].color = newColumnColor;
        this.setState({ columns });
      }
    },

    handleRemoveColumn: columnIndex => {
      const { columns } = this.state;
      columns.splice(columnIndex, 1);
      this.setState({ columns });
    },

    handleAddTask: (column, index) => {
      const { columns } = this.state;
      const newCardContent = window.prompt("Task Name:", `Task ${columns[index].cards.length + 1}`);
      const newCard = {
        id: column.cards.length,
        content: newCardContent,
      };

      if (newCardContent && newCardContent.length > 0) {
        columns[index].cards.push(newCard);
        this.setState({ columns });
      }
    },

    handleEditTask: (columnIndex, cardIndex) => {
      const { columns } = this.state;
      const cardContent = columns[columnIndex].cards[cardIndex].content;
      const newTask = window.prompt("Card Name:", cardContent);

      if (newTask && newTask.length > 0) {
        columns[columnIndex].cards[cardIndex].content = newTask;
        this.setState({ columns });
      }
    },

    handleMoveTask: (card, columnIndex, cardIndex, direction) => {
      const { columns } = this.state;
      if (direction === "left") {
        columns[columnIndex - 1].cards.push(card);
      } else if (direction === "right") {
        columns[columnIndex + 1].cards.push(card);
      }
      columns[columnIndex].cards.splice(cardIndex, 1);
      this.setState({ columns });
    },
    
    handleRemoveTask: (columnIndex, cardIndex) => {
      const { columns } = this.state;
      columns[columnIndex].cards.splice(cardIndex, 1);
      this.setState({ columns });
    },
  };

  render() {
    const { classes } = this.props;
    const { columns } = this.state;
    const { handleAddColumn, handleEditColumn, handleRemoveColumn, handleAddTask } = this.handlers;

    return (
      <div className={classes.root}>
        <Grid container direction="row" spacing={3}>
          {columns.map((column, columnIndex) => {
            return (
              <Grid key={columnIndex} item xs={3} className={classes.column}>
                <Paper id="column">
                  <Paper className={classes.columnHeader} style={{ backgroundColor: column.headerColor }}>
                    <Text align="center" className={classes.columnHeaderText}>
                      {column.name}
                    </Text>
                    <div className={classes.editButton}>
                      <IconButton aria-label="Edit" color="inherit" onClick={() => handleEditColumn(columnIndex)} size="small">
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton aria-label="Delete" color="inherit" onClick={() => handleRemoveColumn(columnIndex)} size="small">
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </div>
                  </Paper>
                  <KanbanCard column={{ index: columnIndex, all: columns, ...column }} handlers={this.handlers} />
                </Paper>
                <Button onClick={() => handleAddTask(column, columnIndex)}>
                  <Add />
                  Add a task
                </Button>
              </Grid>
            );
          })}
        </Grid>
        <Button onClick={() => handleAddColumn()}>
          <Add />
          Add a column
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(KanbanBoard);
