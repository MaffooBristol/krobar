<td class='cell-index'>-</td>
<% if (title && artist) { %>
  <td class='cell-artist' style='font-weight:bold'><%= artist %></td>
  <td class='cell-title' style='font-weight:bold'><%= title %></td>
<% } else { %>
  <td class='cell-filename' colspan='2'><%- file %></td>
<% } %>
<td class='cell-key'><%- key %></td>
<td class='cell-bpm'><%- bpm %></td>
