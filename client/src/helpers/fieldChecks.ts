/**
 * Class of functions to check fields and return appropriate errors accordingly
 */

interface LoginFields {
    email: string,
    password: string
}

class fieldChecks {
    
    static PasswordCheck(password: string, login : boolean){
        if (password === null || password === undefined){
            throw Error('fieldsData Record does not contain password field');
        }
    
        if (password.length === 0){
            return 'Password field cannot be empty';
        }
    
        if (login){
            return '';
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)){
            return "Password did not meet the requirements";
        }

        return ''
    }
    
    static emailCheck(email : string){
        // valid email regex
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if (!emailRegex.test(email)){
            return "Email format is not valid";
        }
        return '';
    }

    static formTofieldsObject(formData: FormData) {
        const fieldsObject : LoginFields = {} as LoginFields;
        formData.forEach((value, key) => fieldsObject[key as keyof LoginFields] = value as string);
        return fieldsObject;
    }
}

export default fieldChecks