import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PageHeader } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import './index.css';

const ModalWinner= (props) => {
  let message;
  if (props.winner === 'x') {
    message = 'X has won this time.'
  } else if (props.winner === 'o') {
    message = 'O has won this time.'
  } else if (props.winner === 't') {
    message = 'The game ended in a tie.'
  }
  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" onClick={props.onContinue}>Play another round</Button>
      </Modal.Footer>
    </Modal>
  )
}

const BaseConfigModal  = (props) => {
  return (
    <Modal show={props.show}>
      <Modal.Header>
        <Modal.Title>Tic Tac Toe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Welcome to yet another Tic Tac Toe game. Please choose, if you want to play as 'X' or 'O'.
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" onClick={props.onChoice.bind(this, -1)}>O</Button>
        <Button bsStyle="primary" onClick={props.onChoice.bind(this, 1)}>X</Button>
      </Modal.Footer>
    </Modal>
  )
}

const Space = (props) => {
  if (props.item === 0) {
    return (
      <td className={'col' + props.col + ' space'} key={props.col} onClick={props.onClick.bind(this, props.row, props.col)}>
      </td>
    )
  } else if (props.item === -1) {
    return (
      <td className={'col' + props.col + (props.winner ? ' winner' : '')} key={props.col}>
        <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="50" r="25" stroke="black" strokeWidth="10" fill="none" />
        </svg>
      </td>
    )
  } else if (props.item === 1) {
    return (
      <td className={'col' + props.col + (props.winner ? ' winner' : '')} key={props.col}>
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
      gameState: 'idle',
      player1Score: 0,
      player2Score: 0,
    }

    // Score Array R1-R3, C1-C3, D1, D2
    this.score = Array(2*3+2).fill(0);
    this.player = true;

    this.handleClick = this.handleClick.bind(this);
    this.handelContinue = this.handelContinue.bind(this);
  }

  componentDidMount() {
    if (this.props.color === -1) {
      this.player = false;
      this.handleClick(
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3)
      )
    }
  }

  handelContinue() {
    // Score Array R1-R3, C1-C3, D1, D2
    this.score = Array(2*3+2).fill(0);
    this.setState({
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      gameState: 'idle',
    }, () => {
      if (this.props.color === -1) {
        this.player = false;
        this.handleClick(
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 3)
        )
      } else {
        this.player = true;
      }
    });
  }

  getPossibleMoves(board) {
    let possiblemoves = [];
    board.forEach((item, row) => {
      item.forEach((elem, col) => {
        if (elem === 0) {
          possiblemoves.push([row, col]);
        }
      })
    });
    return possiblemoves;
  }

  getBoardResult(board, score) {
      let result = '';
      let possiblemoves = this.getPossibleMoves(board);

      if (possiblemoves.length <= 0) {
        result = '0t'
      }

      score.forEach((elem, idx) => {
        if (elem === 3) {
          result = idx + 'x';
        } else if (elem === -3) {
          result = idx + 'o';
        }
      });
      return result;
  }

  makeMove(board, score, player, row, col, color) {
    let point = 0;

    if (player) {
      point = 1 * color;
    } else {
      point = -1 * color;
    }

    board[row][col] = point;

    // http://stackoverflow.com/a/18668901
    score[row] += point;
    score[col + 3] += point;
    if (col === row) score[6] += point;
    if (2 - col === row) score[7] += point;

    return {newboard: board, newscore: score}
  }

  makeAImove(board) {
    let possiblemoves = this.getPossibleMoves(board);
    let AImove = possiblemoves[Math.floor(Math.random() * possiblemoves.length)];
    this.handleClick(AImove[0], AImove[1]);
  }

  handleClick(row, col) {
    // exit, if the game has ended
    if (this.state.gameState !== 'idle') return;

    let {newboard, newscore} = this.makeMove(this.state.board, this.score, this.player, row, col, this.props.color)
    let result = this.getBoardResult(newboard, newscore);

    this.player = !this.player;
    this.score = newscore;

    if (result) {
      this.setState({
        board: newboard,
        gameState: result,
        player1Score: (result.substr(1,2) === 'x') ? this.state.player1Score + 1 : this.state.player1Score,
        player2Score: (result.substr(1,2) === 'o') ? this.state.player2Score + 1 : this.state.player2Score
      })
    } else {
      this.setState({
        board: newboard
      }, () => {
        if (!this.player) {
          this.makeAImove(newboard);
        }
      });
    }
  }

  render() {
    let winnerModal;
    if (this.state.gameState !== 'idle') {
      winnerModal = <ModalWinner winner={this.state.gameState.substr(1,2)} onContinue={this.handelContinue}/>
    }
    return (
      <div>
        {winnerModal}
        <table id='gamefield'>
          <tbody>
            {
              this.state.board.map((element, row) => {
                return (
                  <tr className={'row' + row} key={row}>
                    {
                      element.map((item, col) => {
                        let win = false;
                        if (this.state.gameState !== 'idle' && this.state.gameState !== '0t') {
                          switch (this.state.gameState.substr(0,1)) {
                            case '0':
                              if (row === 0) win = true;
                            break;
                            case '1':
                              if (row === 1) win = true;
                            break;
                            case '2':
                              if (row === 2) win = true;
                            break;
                            case '3':
                              if (col === 0) win = true;
                            break;
                            case '4':
                              if (col === 1) win = true;
                            break;
                            case '5':
                              if (col === 2) win = true;
                            break;
                            case '6':
                              if (row === col) win = true;
                            break;
                            case '7':
                              if (row === 2 - col) win = true;
                            break;
                            default:
                              win = false;
                            break;
                          }
                        }
                        return (
                          <Space
                            item={item}
                            row={row}
                            col={col}
                            onClick={this.handleClick}
                            key={'' + row + col}
                            winner={win}
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
        <hr />
        Player 1 Score: {this.state.player1Score}<br />
        Player 2 Score: {this.state.player2Score}
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      color: undefined
    }

    this.handlePlayerChoice = this.handlePlayerChoice.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset() {
    this.setState({
      color: undefined
    })
  }

  handlePlayerChoice (choice) {
    if (choice === -1) {
      this.setState({
        color: -1
      })
    } else if (choice === 1) {
      this.setState({
        color: 1
      })
    }
  }

  render() {
    let mainAction;
    if (!this.state.color) {
      mainAction = <BaseConfigModal show={true} onChoice={this.handlePlayerChoice}/>
    } else {
      mainAction = (
        <div>
          <TicTacToeGame color={this.state.color}/>
          <Button bsStyle="danger" id="resetbtn" onClick={this.handleReset}>Restart All</Button>
        </div>
      )
    }
    return (
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            <PageHeader>freeCodeCamp: Build a Tic Tac Toe Game
              <br/><small>Project by camper <a href="https://www.freecodecamp.com/mperkh" target="_blank">Michael Perkhofer</a></small>
            </PageHeader>
            {mainAction}
          </Col>
        </Row>
      </Grid>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
