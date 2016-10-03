import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Space = (props) => {

  let output;

  if (props.item === 0) {
    output = (
      <button
        onClick={props.onClick.bind(this, props.row, props.col)}
      >
        Press
      </button>
    )
  } else {
    output = props.item;
  }

  return (
    <span>
      {output}
    </span>
  );
};

class TicTacToeGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      // Score Array R1-R3, C1-C3, D1, D2
      score: Array(2*3+2).fill(0),
      player: true,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

  }

  handleClick(row, col) {
    let newboard = this.state.board;
    let newscore = this.state.score;
    let point = 0;

    if (this.state.player) {
      point = 1;
    } else {
      point = -1;
    }

    newboard[row][col] = point;

    // http://stackoverflow.com/a/18668901
    newscore[row] += point;
    newscore[col + 3] += point;
    if (col === row) newscore[6] += point;
    if (2 - col === row) newscore[7] += point;

    this.setState({
      board: newboard,
      score: newscore,
      player: !this.state.player
    }, () => {

      this.state.score.forEach((elem) => {
        if (elem === 3) {
          console.log('+1 wins');
        } else if (elem === -3) {
          console.log('-1 wins');
        }
      });

      let possiblemoves = [];
      this.state.board.forEach((item, row) => {
        item.forEach((elem, col) => {
          if (elem === 0) {
            possiblemoves.push([row, col]);
          }
        })
      });

      let AImove = possiblemoves[Math.floor(Math.random()*possiblemoves.length)];

      if (!this.state.player) {
        this.handleClick(AImove[0], AImove[1]);
      }

    });
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            {
              this.state.board.map((element, row) => {
                return (
                  <tr key={row}>
                    {
                      element.map((item, col) => {
                        return (
                          <td key={col}>
                            <Space
                              item={item}
                              row={row}
                              col={col}
                              onClick={this.handleClick}
                            />
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <TicTacToeGame />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
