import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import BmiForm from '../BmiForm/BmiForm';
import Info from '../Info/Info';
import Bar from '../Bar/Bar';
import { getData, storeData } from '../../helpers/localStorage';
import AvgBMIMale from "./AvgBMIMale";
import AvgBMIFemale from "./AvgBMIFemale";
import Contact from "./Contact";

const App = () => {
  const initialState = () => getData('data') || [];
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});

  useEffect(() => {
    storeData('data', state);
    const date = state.map(obj => obj.date);
    const bmi = state.map(obj => obj.bmi);
    let newData = { date, bmi };
    setData(newData);
  }, [state]);

  const handleChange = val => {
    let heightInM = val.height / 100;
    val.bmi = (val.weight / (heightInM * heightInM)).toFixed(2);
    val.id = uuidv4();
    let newVal = [...state, val];
    let len = newVal.length;
    if (len > 7) newVal = newVal.slice(1, len);
    setState(newVal);
  };

  const handleDelete = id => {
    storeData('lastState', state);
    let newState = state.filter(i => {
      return i.id !== id;
    });
    setState(newState);
  };

  const handleUndo = () => {
    setState(getData('lastState'));
  };

  return (
    <div className='container'>
      <div className='row center'>
        <h1 className='white-text'> BMI Tracker </h1>
      </div>
      <div className='row'>
        <div className='col m12 s12'>
          <BmiForm change={handleChange} />
          <Bar labelData={data.date} bmiData={data.bmi} />
          <div>
            <div className='row center'>
              <h4 className='white-text'>7 Day Data</h4>
            </div>
            <div className='data-container row'>
              {state.length > 0 ? (
                <>
                  {state.map(info => (
                    <Info
                      key={info.id}
                      id={info.id}
                      weight={info.weight}
                      height={info.height}
                      date={info.date}
                      bmi={info.bmi}
                      deleteCard={handleDelete}
                    />
                  ))}
                </>
              ) : (
                  <div className='center white-text'>No log found</div>
                )}
            </div>
          </div>
          {getData('lastState') !== null ? (
            <div className='center'>
              <button className='calculate-btn' onClick={handleUndo}>
                Undo
              </button>
            </div>
          ) : (
              ''
            )}
            <div>
              <h1>Average and Ideal BMI</h1>
              <p>The average BMI for an Adult is somewhere between 18.5 and 24.9.
                This is the ideal and healthy BMI value for any adult. Values between 25 and 29.9 are considered
                overweight, any value greater than 30 is considered obese and Values
                under 18.5 are underweight.
              </p>
            </div>
            <div>
              <h2>Tips on Better BMI</h2>
              <p>Some tips for having a better BMI value include, but aren't limited to:
                Frequent exercise, doing some workouts everyday can help improve
                weight loss and thus improve one's overall BMI value. Another tip
                includes healthy eating habbits, avoid frequent junk foods or fast food
                options and eating more fruits and vegetables in one's diet.
              </p>
            </div>
            <div>
              <h2>Notes and Exceptions</h2>
              <p>While the above do help and assist with maintaining the ideal
                BMI value, there are some notable cases that may hinder or help
                them. Various users have different metabolism rates, quicker rates
                can help lose or maintain their weight, thus reducing or negating the need
                for exercise or a diet. Slower rates hinder weight loss and make
                it more difficult to lose the weight even with diets and exercise.
                Other factors include various diseases such as Diabetes which hinders
                ones sugar intake.
              </p>
            </div>
            <div>
              <p>As noted, the BMI value is different for everyone based on their
                weight and height, taller users of 200 lbs have a different Bmi
                value than shoter users of the same weight.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
