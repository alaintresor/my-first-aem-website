async function fetchData(jsonURL) {
  const response = await fetch(jsonURL);
  const data = await response.json();

  return data;
}

async function handleSubmit(formAction, likeButton) {
  try {
    likeButton.disabled = true;

    const ArticleID = new URL(window.location.href).pathname.split('/')[2];

    // create payload
    const payload = {
      ArticleID,
    };
    const response = await fetch(formAction, {
      method: 'POST',
      body: JSON.stringify({ data: payload }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      likeButton.textContent = 'Liked';
      likeButton.disabled = false;
    }
  } catch (e) {
    console.log(e);
  } finally {
    // form.setAttribute('data-submitting', 'false');
    console.log('done');
  }
}

export default async function decorate(block) {
  const jsonURL = block.querySelector('a[href$=".json"]');
  const { pathname } = new URL(jsonURL.href); // Get href directly
  const { data } = await fetchData(jsonURL);

  const articleId = new URL(window.location.href).pathname.split('/')[2];
  const likes = data.filter((item) => item.articleID === articleId);

  //   const form = document.createElement('form');
  // eslint-disable-next-line prefer-destructuring
  const formAction = pathname.split('.json')[0];
  const btnLabel = block.children[1].firstElementChild.textContent;
  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  const span = document.createElement('span');
  span.textContent = likes[0] ? `${likes[0].totalLikes} like(s)` : '0 like(s)'; // Use template literals
  // eslint-disable-next-line prefer-template
  containerDiv.append(span);
  const likeButton = document.createElement('button');
  likeButton.className = 'like-button';
  likeButton.textContent = btnLabel;
  likeButton.addEventListener('click', () => {
    span.textContent = `${parseInt(span.textContent, 10) + 1} likes`;
    handleSubmit(formAction, likeButton);
  });
  containerDiv.append(likeButton);

  block.textContent = '';
  block.append(containerDiv);
}
