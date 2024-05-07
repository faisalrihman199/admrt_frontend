import React from 'react';
import {
    Checkbox,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from "@material-tailwind/react";

const CheckBoxes = ({ options, selected, setState, flexType }) => {
    const handleCheck = (value) => {
        setState(prevState => ({ ...prevState, [value]: !prevState[value] }));
    };

    return (
        <List className={`${flexType}`}>
            {options.map(option => (
                <ListItem className="p-0" key={option.value}>
                    <label
                        htmlFor={option.value}
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                    >
                        <ListItemPrefix className="mr-3">
                            <Checkbox
                                id={option.value}
                                ripple={false}
                                checked={selected[option.value]}
                                onChange={() => handleCheck(option.value)}
                                className="hover:before:opacity-0"
                                containerProps={{
                                    className: "p-0",
                                }}
                                color={selected[option.value] ? "lightBlue" : "gray"}

                            />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                            {option.label}
                        </Typography>
                        {option.icon && <option.icon className="ml-2" />}

                    </label>
                </ListItem>
            ))}
        </List>
    );
};

export default CheckBoxes;