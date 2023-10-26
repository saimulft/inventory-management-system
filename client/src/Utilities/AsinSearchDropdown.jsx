import { Dropdown } from 'semantic-ui-react'


const AsinSearchDropdown = ({ setAsinUpcOption, asinUpcOption, asinUpcData }) => {

    const handleDropdownChange = (e, { value }) => {
        setAsinUpcOption(value);
    };

    return (
        <Dropdown
            className='custom_css_sui'
            clearable
            fluid
            search
            selection
            options={asinUpcData}
            placeholder='Select ASIN or UPC'
            value={asinUpcOption}
            onChange={handleDropdownChange}
        />
    )
}


export default AsinSearchDropdown
