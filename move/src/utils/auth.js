export function getsomePeople() {
    return localStorage.getItem("somePeople");
}

export function setsomePeople(somePeople) {
    return localStorage.setItem("somePeople", somePeople);
}

export function getsurePeople() {
    return localStorage.getItem("surePeople");
}

export function setsurePeople(surePeople) {
    return localStorage.setItem("surePeople", surePeople);
}