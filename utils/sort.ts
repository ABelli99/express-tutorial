export function getSortQuery(json: JSON): string{

    let sortStr: string = JSON.stringify(json);
    //string manipulation for removing spaces &stuffs
    sortStr = sortStr.replace(/"|\{|\}|\n/g,"");
    //turning sort operators into numbers
    sortStr = sortStr.replace(/(asc)/g, "1");
    sortStr = sortStr.replace(/(desc)/g, "-1");

    let temp: string[] = [];

    //multiple sort options (I.E.: name asc & surname desc)
    sortStr.split(",").forEach((n:string) => {
        //getting the subarrays
        let subArray = n.split(":");
        //compacting the string
        if(subArray[1].includes("-"))
            subArray[0] = "-"+subArray[0];
        //adding the compacted string into a temp array
        temp.push(subArray[0]);
    });

    //removing the , for the mongoose sort
    let result: string = temp.toString().replace(","," ");
    console.log(result);
    return result;
}