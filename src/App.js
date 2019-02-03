import React, { Fragment, Component } from 'react';
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

const isWeekend = d => d.getDay() === 6 || d.getDay() === 0;

const plusMonth = (d, mod) => {
  const dd = new Date(d);
  dd.setMonth(dd.getMonth() + mod);
  return dd;
};

const now = new Date();
now.setDate(1);

function makeSeedDropdown() {
  return [
    plusMonth(now, -3),
    plusMonth(now, -2),
    plusMonth(now, -1),
    plusMonth(now, 0),
    plusMonth(now, 1),
    plusMonth(now, 2),
    plusMonth(now, 3),
    plusMonth(now, 4),
    plusMonth(now, 5),
    plusMonth(now, 6)
  ];
}

const startModifier = now.getDate() < 15 ? -1 : 0;

class App extends Component {
  state = {
    days: [],
    dropdown: makeSeedDropdown(),
    seedDate: plusMonth(now, startModifier).getTime()
  };

  componentDidMount() {
    this.daysForMonth(new Date(Number(this.state.seedDate)));
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
    const s = new Date(Number(value));

    this.daysForMonth(s);
    this.setState({
      seedDate: Number(value)
    });
  };

  render() {
    const { days, dropdown, seedDate } = this.state;

    const grouped = days.reduce(
      (acc, day) => {
        if (day.date.getDay() === 0) {
          acc.push([]);
        }

        acc[acc.length - 1].push(day);

        return acc;
      },
      [[]]
    );

    console.log(grouped);

    return (
      <div className="page">
        <h1>Days worked</h1>
        <div className="split">
          <div>
            <select onChange={this.setSeedDate}>
              {dropdown.map((d, index) => (
                <option
                  value={d.getTime()}
                  key={index}
                  selected={seedDate === d.getTime()}
                >
                  {moment(d).format('MMMM, YYYY')}
                </option>
              ))}
            </select>
            <br />
            <table>
              <tbody>
                {grouped.map(days => (
                  <Fragment>
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
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                  </Fragment>
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
