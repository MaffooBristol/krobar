<nav class='btn-set <%= process.platform %>'>
  <% _.each(buttons, function(button) { %>
    <button class='btn-os <%= button %>'></button>
  <% }); %>
</nav>
<nav class='btn-set fs-<%= process.platform %>'>
  <button class='btn-os fullscreen'></button>
</nav>
<h1>Krobar</h1>
