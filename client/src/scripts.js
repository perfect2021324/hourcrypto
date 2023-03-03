




document.onreadystatechange = (e) => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    console.debug(tooltipTriggerList)
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZTM2MDAiLCJhIjoiY2w5a3l4Mmx6MDFpODN3cWFtcHdxeW4yZiJ9.NQgAoK85Z6iC7z1UxA0I9Q'