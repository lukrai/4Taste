export function flattenArray(array: any[]) {
    return array.reduce((acc, val) => acc.concat(val), []);
}

export function sortFeedByDate(feedData: any[]) {
    feedData.sort(function (a, b) {
        return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
    });
    return feedData;
}