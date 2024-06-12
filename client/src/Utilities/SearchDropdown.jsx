import Select from 'react-select'

const SearchDropdown = ({ setOption, option, optionData, placeholder, isMulti, isLoading, Customkey }) => {

    return (
        <Select
            className='shadow-lg'
            options={optionData}
            value={option}
            onChange={setOption}
            placeholder={placeholder}
            isMulti={isMulti}
            isLoading={isLoading}
            key={Customkey}
        />
    )
}

export default SearchDropdown;
