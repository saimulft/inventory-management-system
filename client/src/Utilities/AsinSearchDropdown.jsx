import Select from 'react-select'

const AsinSearchDropdown = ({ setAsinUpcOption, asinUpcOption, asinUpcData }) => {

    return (
        <Select
            options={asinUpcData}
            value={asinUpcOption}
            onChange={setAsinUpcOption}
            placeholder="Select ASIN or UPC"
        />
    )
}

export default AsinSearchDropdown
