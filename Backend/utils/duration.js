
function estimatedRideDurationHours(fromPincode,toPincode)
{
    return Math.abs(fromPincode - toPincode) % 24;
}

export default estimatedRideDurationHours;
