document.addEventListener('DOMContentLoaded', function () {
  const albumListContainer = document.getElementById('albumList');
  const newAlbumForm = document.getElementById('newAlbumForm');
  const newAlbumTitleInput = document.getElementById('newAlbumTitle');
  const loadMoreButton = document.getElementById('loadMoreButton');

  let displayedAlbums = 0;

  newAlbumForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const newAlbumTitle = newAlbumTitleInput.value;

    fetch('https://jsonplaceholder.typicode.com/albums', {
      method: 'POST',
      body: JSON.stringify({ title: newAlbumTitle }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(data => {
        newAlbumTitleInput.value = '';
        const newAlbumElement = createAlbumElement(data);
        albumListContainer.appendChild(newAlbumElement);
      })
      .catch(error => console.error('Error adding new album:', error));
  });

  loadAlbums();

  function loadAlbums() {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.json())
      .then(albums => {
        const albumsToDisplay = albums.slice(displayedAlbums, displayedAlbums + 10);

        fetch('https://jsonplaceholder.typicode.com/photos')
          .then(response => response.json())
          .then(photos => {
            const albumsWithPhotos = albumsToDisplay.map(album => {
              const albumPhotos = photos.filter(photo => photo.albumId === album.id);
              return { ...album, photos: albumPhotos };
            });

            displayAlbums(albumsWithPhotos);
          })
          .catch(error => console.error('Error fetching photos:', error));
      })
      .catch(error => console.error('Error fetching albums:', error));
  }

  function displayAlbums(albums) {
    albums.forEach(album => {
      const albumElement = createAlbumElement(album);
      albumListContainer.appendChild(albumElement);
      displayedAlbums++;
    });

    // Show/hide the "Load More" button based on the remaining albums
    if (displayedAlbums < 100) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
    }
  }

  function createAlbumElement(album) {
    const albumDiv = document.createElement('div');
    albumDiv.classList.add('box');

    const albumTitle = document.createElement('h2');
    albumTitle.classList.add('title', 'is-4', 'has-text-centered');
    albumTitle.textContent = album.title;

    const photoList = document.createElement('ul');
    album.photos.forEach(photo => {
      const photoItem = document.createElement('li');
      photoItem.textContent = photo.title;
      photoList.appendChild(photoItem);
    });

    const editButton = createButton('Edit', () => editAlbum(album.id, albumTitle));
    const deleteButton = createButton('Delete', () => deleteAlbum(album.id, albumDiv));

    albumDiv.appendChild(albumTitle);
    albumDiv.appendChild(photoList);
    albumDiv.appendChild(editButton);
    albumDiv.appendChild(deleteButton);

    return albumDiv;
  }

  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.classList.add('button', 'is-primary', 'is-small');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  function editAlbum(albumId, albumTitleElement) {
    console.log(`Editing album with ID ${albumId}`);

    albumTitleElement.setAttribute('contenteditable', 'true');
    albumTitleElement.focus();

    albumTitleElement.addEventListener('blur', function () {
      const updatedAlbumTitle = albumTitleElement.textContent.trim();

      fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: updatedAlbumTitle }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(data => console.log('Updated album title:', data))
        .catch(error => console.error('Error updating album title:', error));

      albumTitleElement.setAttribute('contenteditable', 'false');
    });
  }

  function deleteAlbum(albumId, albumElement) {
    console.log(`Deleting album with ID ${albumId}`);
    fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Album deleted successfully');
          albumListContainer.removeChild(albumElement);
        } else {
          throw new Error('Error deleting album');
        }
      })
      .catch(error => console.error('Error deleting album:', error));
  }


});
