// document.addEventListener('DOMContentLoaded',()=>{
// fetchLists();
// });


fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.json())
      .then(albums=>{
        const AlbumsList=document.getElementById('list-album');
        albums.forEach(album => {
            const Album=document.createElement('h2' );
            Album.textContent=album;
            AlbumsList.appendChild(Album);
            console.log( AlbumsList)
            
            
        });
      })


