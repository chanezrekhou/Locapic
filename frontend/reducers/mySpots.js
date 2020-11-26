export default function (mySpots = [], action) {
    if (action.type == 'saveSpot') {
        var mySpotsCopy = [...mySpots];
        mySpotsCopy.push(action.listPOI);
        return mySpotsCopy;
    } else {
        return mySpots;
    }
}