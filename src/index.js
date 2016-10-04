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
  if (props.winner === 'xwon') {
    message = 'X has won this time.'
  } else if (props.winner === 'owon') {
    message = 'O has won this time.'
  } else if (props.winner === 'tie') {
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
      <td className={'col' + props.col} key={props.col}>
        <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="50" r="25" stroke="black" strokeWidth="10" fill="none" />
        </svg>
      </td>
    )
  } else if (props.item === 1) {
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
      gameState: 'idle',
      player1Score: 0,
      player2Score: 0,
    }

    this.handleClick = this.handleClick.bind(this);
    this.handelContinue = this.handelContinue.bind(this);
  }

  componentDidMount() {
    if (this.props.color === -1) {
      this.setState({
        player: false
      }, () => {
        this.handleClick(
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 3)
        )
      })
    }
  }

  handelContinue() {
    if (this.props.color === -1) {
      this.setState({
        player: false,
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        // Score Array R1-R3, C1-C3, D1, D2
        score: Array(2*3+2).fill(0),
        gameState: 'idle',
      }, () => {
        this.handleClick(
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 3)
        )
      })
    } else {
      this.setState({
        player: true,
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        // Score Array R1-R3, C1-C3, D1, D2
        score: Array(2*3+2).fill(0),
        gameState: 'idle',
      })
    }
  }

  handleClick(row, col) {
    let result = '';
    let possiblemoves = [];

    if (this.state.gameState !== 'idle') return;

    let newboard = this.state.board;
    let newscore = this.state.score;
    let point = 0;

    if (this.state.player) {
      point = 1 * this.props.color;
    } else {
      point = -1 * this.props.color;
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

      this.state.board.forEach((item, row) => {
        item.forEach((elem, col) => {
          if (elem === 0) {
            possiblemoves.push([row, col]);
          }
        })
      });

      if (possiblemoves.length <= 0) {
        result = 'tie'
      }

      this.state.score.forEach((elem, idx) => {
        if (elem === 3) {
          result = 'xwon';
        } else if (elem === -3) {
          result = 'owon';
        }
      });

      if (result) {
        this.setState({
          gameState: result,
          player1Score: (result === 'xwon') ? this.state.player1Score + 1 : this.state.player1Score,
          player2Score: (result === 'owon') ? this.state.player2Score + 1 : this.state.player2Score
        })
      } else if (!this.state.player) {
          let AImove = possiblemoves[Math.floor(Math.random() * possiblemoves.length)];
          this.handleClick(AImove[0], AImove[1]);
      }
    });
  }

  render() {
    let winnerModal;
    if (this.state.gameState !== 'idle') {
      winnerModal = <ModalWinner winner={this.state.gameState} onContinue={this.handelContinue}/>
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
