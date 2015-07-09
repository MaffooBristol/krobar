<% if (title && artist) { %>
  <td style='font-weight:bold'><%= artist %></td><td style='font-weight:bold'><%= title %></td>
<% } else { %>
  <td colspan='2'><%- file %></td>
<% } %>
<td><%- key %></td>
<td><%- bpm %></td>
