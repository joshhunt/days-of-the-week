import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

function getDaysInMonth(seedDate) {
  const month = seedDate.getMonth();
  var date = new Date(seedDate.getFullYear(), month, 1);
  var days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function parseDate(s) {
  var b = s.split(/\D/);
  return new Date(b[0], --b[1], b[2]);
}

const isWeekend = d => d.getDay() === 6 || d.getDay() === 0;

class App extends Component {
  state = { days: [] };

  componentDidMount() {
    this.daysForMonth(new Date());
  }

  daysForMonth = seedDate => {
    this.setState({
      days: getDaysInMonth(seedDate).map(date => ({
        id: date.getDate().toString(),
        date,
        didWork: isWeekend(date) ? false : true
      }))
    });
  };

  changeDayWorked = ev => {
    const { name, checked } = ev.target;

    this.setState({
      days: this.state.days.map(d =>
        d.id === name ? { ...d, didWork: checked } : d
      )
    });
  };

  serialiseTimesheet = () => {
    return this.state.days
      .filter(d => d.didWork)
      .map(d => moment(d.date).format('dddd, Do MMM'))
      .map(s => `${s}: 1 day`)
      .join('\n');
  };

  setSeedDate = ev => {
    const { value } = ev.target;
    console.log(value);

    this.daysForMonth(parseDate(value));
  };

  render() {
    const { days } = this.state;

    return (
      <div className="page">
        <h1>Days worked</h1>
        <div className="split">
          <div>
            Seed: <input type="date" onChange={this.setSeedDate} />
            <table>
              <tbody>
                {days.map((day, index) => (
                  <tr>
                    <td>
                      <label htmlFor={`checkbox_${day.id}`}>
                        {moment(day.date).format('dddd, Do MMM')}
                      </label>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={day.didWork}
                        id={`checkbox_${day.id}`}
                        name={day.id}
                        onChange={this.changeDayWorked}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <textarea value={this.serialiseTimesheet()} className="textarea" />
        </div>
      </div>
    );
  }
}

export default App;
