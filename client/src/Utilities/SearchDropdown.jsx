import Select from 'react-select'

const SearchDropdown = ({ setOption, option, optionData, placeholder }) => {

    return (
        <Select
        className='shadow-lg'
            options={optionData}
            value={option}
            onChange={setOption}
            placeholder={placeholder}
        />
    )
}

export default SearchDropdown
