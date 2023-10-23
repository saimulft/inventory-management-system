
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

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
            placeholder='Select Country'
            value={asinUpcOption}
            onChange={handleDropdownChange}

        />

    )
}


export default AsinSearchDropdown
