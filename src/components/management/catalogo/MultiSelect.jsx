import './MultiSelect.css';

const MultiSelect = ({ value, onChange, options = [], error }) => {
    const toggleOption = (optionValue) => {
        const newValue = value.includes(optionValue)
            ? value.filter(val => val !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeOption = (optionValue) => {
        onChange(value.filter(val => val !== optionValue));
    };

    const getLabelByValue = (val) => {
        const found = options.find(opt => opt.value === val);
        return found ? found.label : val;
    };


    return (
        <div className="category-multiselect">
            <label>Categorías</label>
            <div className={`multiselect-box ${error ? 'error' : ''}`}>
                <div className="selected-tags">
                    {value.map((val, i) => (
                        <span key={`${val}-${i}`} className="tag">
                            {getLabelByValue(val)}
                            <button type="button" onClick={() => removeOption(val)}>×</button>
                        </span>
                    ))}
                </div>
                <div className="options-list">
                    {
                        options.map((opt, i) => (
                            <div
                                key={`${opt.value}-${i}`}
                                className={`option ${value.includes(opt.value) ? 'selected' : ''}`}
                                onClick={() => toggleOption(opt.value)}  
                            >
                                {opt.label}
                            </div>
                        ))
                    }
                </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default MultiSelect;
