import Select from 'react-select'

const SearchDropdown = ({ setOption, option, optionData, placeholder, isMulti, isLoading }) => {

    return (
        <Select
            className='shadow-lg'
            options={optionData}
            value={option}
            onChange={setOption}
            placeholder={placeholder}
            isMulti={isMulti}
            isLoading={isLoading}
        />
    )
}

export default SearchDropdown;
