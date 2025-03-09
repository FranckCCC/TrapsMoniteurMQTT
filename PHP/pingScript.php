<?php
if (isset($_GET['ip'])) {
  $ip = $_GET['ip'];
  $output = shell_exec("ping -n 1 -w 1 $ip"); // Pour Windows, ajustez pour d'autres OS
  $online = strpos($output, 'TTL') !== false;
  
  header('Content-Type: application/json');
  echo json_encode(['ip' => $ip, 'status' => $online]);
}
?>
