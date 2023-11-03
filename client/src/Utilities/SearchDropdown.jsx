import Select from 'react-select'

const SearchDropdown = ({ setOption, option, optionData, placeholder, isMulti }) => {

    return (
        <Select
            className='shadow-lg'
            options={optionData}
            value={option}
            onChange={setOption}
            placeholder={placeholder}
            isMulti={isMulti}
        />
    )
}

export default SearchDropdown
