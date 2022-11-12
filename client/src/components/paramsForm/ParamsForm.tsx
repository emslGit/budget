import React, { useRef } from 'react';
import { strings } from '../../utils/strings';
import { IFinanceParams } from '../../utils/interfaces';
import './paramsForm.css';

interface Props {
  handleUpdateClick(params: IFinanceParams): void;
}

const ParamsForm: React.FC<Props> = ({handleUpdateClick}: Props) => {
  const roiInput = useRef<HTMLInputElement>(null);
  const inflationInput = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    handleUpdateClick({
      roi: roiInput.current ? Number(roiInput.current.value) : 0,
      inflation: inflationInput.current ? Number(inflationInput.current.value) : 0
    });
  }

  return (
    <div className="paramsForm card">
      <h4>Parameters</h4>
      <form onSubmit={(ev) => handleFormSubmit(ev)}>
        <div>
          <label>{strings.roi}</label>
          <span>
            <input ref={roiInput} defaultValue={12} type="number"></input>
            <span>%</span>
          </span>
        </div>
        <div>
          <label>{strings.inflation}</label>
          <span>
            <input ref={inflationInput} defaultValue={2} type="number"></input>
            <span>%</span>
          </span>
        </div>
        <hr></hr>
        <button className="btn-small">Update</button>
      </form>
    </div>
  );
}

export default ParamsForm;
