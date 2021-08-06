import React from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.numJokesToGet = props.numJokesToGet;
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    const jokes = this.state.jokes;
    let seenJokes = new Set();
    let count = 0;
    try {
      while (count < this.numJokesToGet) {
        let res = await axios.get('https://icanhazdadjoke.com', {
          headers: { Accept: 'application/json' },
        });
        count++;
        let { status, ...jokeObj } = res.data;
        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          jokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.error('duplicate found!');
        }
      }
      this.setState({ jokes });
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    this.setState(() => ({ jokes: [] }));
  }

  vote(id, delta) {
    this.setState((curr) => ({
      jokes: curr.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

    return (
      <div className='JokeList'>
        <button className='JokeList-getmore' onClick={this.generateNewJokes}>
          Get New Jokes
        </button>

        {sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
          />
        ))}
      </div>
    );
  }
}

JokeList.defaultProps = {
  numJokesToGet: 10,
};

export default JokeList;
