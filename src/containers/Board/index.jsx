//react imports
import React from "react";
import { withStyles } from "@material-ui/styles";
import { Button, Grid, IconButton, Paper, Typography as Text, TextField } from "@material-ui/core";
import { Add, ChevronLeft, ChevronRight } from "@material-ui/icons";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding:25
  },
  columnHeader: {
    height: 30,
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": { cursor: "pointer" },
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
});

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          id: 0,
          name: "Verdi",
          headerColor: "#8E6E95",
          cards: [],
        },
        {
          id: 1,
          name: "Beethoven",
          headerColor: "#39A59C",
          cards: [],
        },
        {
          id: 2,
          name: "Mozart",
          headerColor: "#344759",
          cards: [],
        },
        {
          id: 3,
          name: "Bach",
          headerColor: "#E8741E",
          cards: [],
        },
      ],
    };
  }

  handleAddTask(column, index) {
    const { columns } = this.state;
    const newCardContent = window.prompt("Task Name:", `Task ${columns[index].cards.length + 1}`);
    const newCard = {
      id: column.cards.length,
      content: newCardContent,
    };
    columns[index].cards.push(newCard);
    this.setState(state => ({ columns }));
  }

  handleMoveTaskLeft(card, columnIndex, cardIndex) {
    const { columns } = this.state;
    columns[columnIndex - 1].cards.push(card);
    columns[columnIndex].cards.splice(cardIndex, 1);
    this.setState({ columns });
  }

  handleMoveTaskRight(card, columnIndex, cardIndex) {
    const { columns } = this.state;
    columns[columnIndex + 1].cards.push(card);
    columns[columnIndex].cards.splice(cardIndex, 1);
    this.setState({ columns });
  }

  handleChangeName = e => index => {
    const { columns } = this.state;
    alert(e);
    columns[index].changeName = true;
    columns[index].name = e.target.value;
    this.setState({ columns });
  };

  handleSaveName = e => index => {
    const { columns } = this.state;
    columns[index].changeName = false;
    if (columns[index].name && columns[index].name.length > 0) this.setState({ columns });
  };

  render() {
    const { classes } = this.props;
    const { columns } = this.state;
    return (
      <div className={classes.root}>
        <Grid container direction="row" spacing={3}>
          {columns.map((column, columnIndex) => {
            return (
              <Grid key={columnIndex} item xs={3} className={classes.column}>
                <Paper id="column">
                  <Paper className={classes.columnHeader} style={{ backgroundColor: column.headerColor }} onClick={() => this.handleChangeName(columnIndex)}>
                    {!column.changeName && (
                      <Text align="center" color="inherit">
                        {column.name}
                      </Text>
                    )}
                    {column.changeName && <TextField align="center" color="inherit" value={columns[columnIndex].name} onChange={this.handleChangeName(columnIndex)} />}
                  </Paper>
                  {column.cards.map((card, cardIndex) => {
                    return (
                      <Paper key={cardIndex} className={classes.card}>
                        {columnIndex > 0 && (
                          <IconButton onClick={() => this.handleMoveTaskLeft(card, columnIndex, cardIndex)}>
                            <ChevronLeft className={classes.arrow} />
                          </IconButton>
                        )}
                        <Text className={classes.cardContent}>{card.content}</Text>
                        {columnIndex < this.state.columns.length - 1 && (
                          <IconButton onClick={() => this.handleMoveTaskRight(card, columnIndex, cardIndex)}>
                            <ChevronRight className={classes.arrow} />
                          </IconButton>
                        )}
                      </Paper>
                    );
                  })}
                </Paper>
                <Button onClick={() => this.handleAddTask(column, columnIndex)}>
                  <Add />
                  Add a card
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Board);
