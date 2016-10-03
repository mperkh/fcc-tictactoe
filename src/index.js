import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Space = (props) => {
  if (props.item === 0) {
    return (
      <td className={'col' + props.col + ' space'} key={props.col} onClick={props.onClick.bind(this, props.row, props.col)}>
      </td>
    )
  } else if (props.item === 1) {
    return (
      <td className={'col' + props.col} key={props.col}>
        <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="50" r="25" stroke="black" strokeWidth="10" fill="none" />
        </svg>
      </td>
    )
  } else if (props.item === -1) {
    return (
      <td className={'col' + props.col} key={props.col}>
        <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" x2="75" y1="15" y2="75" stroke="black" strokeWidth="10" />
          <line x1="15" x2="75" y1="75" y2="15" stroke="black" strokeWidth="10" />
        </svg>
      </td>
    )
  }
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
                  <tr className={'row' + row} key={row}>
                    {
                      element.map((item, col) => {
                        return (
                          <Space
                            item={item}
                            row={row}
                            col={col}
                            onClick={this.handleClick}
                            key={'' + row + col}
                          />
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
