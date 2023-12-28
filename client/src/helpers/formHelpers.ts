export function extractFields(target : EventTarget){
    const fieldData = new FormData(target as HTMLFormElement);
    const fieldRecord : Record<string, string> = {};
    for (const [key, value] of fieldData){
        fieldRecord[key] = value.toString();
    }
    return fieldRecord;
}