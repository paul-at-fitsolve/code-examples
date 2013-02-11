<?php
 
class lineage {
  
  private $_tid;
  private $_lineages;
  private $_filter;

  public function __construct($tid) {
    if (! is_numeric($tid)) {
      return;
    }
    $this->_tid = $tid;
    //Work out all the lineages and store within the object.
    $this->_lineages = $this->orchestrateLineages($this->_tid);
  }

/**
 * @return the $_lineages
 */
  public function getLineages() {
    return $this->_lineages;
  }


/**
 * @return the $_tid
 */
  public function getTid() {
    return $this->_tid;
  }
 

  // This function starts the recursive calls to obtain an array of lineages.
  private function orchestrateLineages($tid) {
    $vals = array();
    $lines = array();
    $lineages = $this->getTermLineages($tid);
    foreach ($lineages as $lineage) {
      $lines [] = $this->_array_flatten($this->_process_lineage($lineage),$vals);
 
    }

    //Step 1 - Have we got multiple lines in this array?
    foreach($lines as $line) {
      foreach (array_reverse($line) as $key => $entry) {
        if (strstr($entry , 'Offices') && $key > 0) { 
          $this->_filter = true;
        }
        if (strstr($entry , 'Stores') && $key > 0) {
          $this->_filter = true;
        }
      }
    }
    //Bail if there is no reason to do any more processing! We already have a unique line.
    if (!$this->_filter) {
      return $lines;
    }
    //Step 2 - Seperate out the lines.
    foreach ($lines as $line) {
      $seperate = array();
      foreach (array_reverse($line) as $key => $entry) {
        $i = 0;
        if (strstr($entry , 'Offices') && $key > 0) {
          $output[$i][] = array_reverse($seperate);
          $seperate = array();
          $i++;
        }
       if (strstr($entry , 'Stores') && $key > 0)   {
          $output[$i][] = array_reverse($seperate);
          $seperate = array();
          $i++;
        }    
        if ($key == count($line) - 1) {
          $seperate [] = $entry;
          $output[$i][] = array_reverse($seperate);
          break;
        }
        $seperate [] = $entry;
      }
    }
    //Step 3 - Add the common tail terms.
    $count_output = count($output[0]);
    if ($count_output > 1) {
      $last_element = $count_output-1;
      $count_first = count($output[0][0]);
      $diff = count($output[0][$last_element]) - $count_first;
      $tail = $output[0][$last_element];
      $tail = array_reverse(array_slice($tail, 0 , $diff));
      foreach ($output[0] as $index => &$element) {
       if ($index < (count($output[0]) -1)){
        foreach ($tail as $tailterm) {
         array_unshift($element, $tailterm);
        }
       }
      }
    }
    return $output[0];
  }
  
 
  /**
   * Recursive function to calculate multiple lineages from a given entry_point.
   * @param field_type $_entry_point
   */
  private function getTermLineages($tid)
  {
    $lineages = array();
    $lines = array();
    $result = db_query('SELECT th.tid, th.parent, td.name FROM {taxonomy_term_hierarchy} th LEFT JOIN {taxonomy_term_data} td ON td.tid = th.tid WHERE td.tid = :tid', array(':tid' => $tid));
    
    foreach ($result as $term){
      $parents = $this->getTermLineages($term->parent);
      if (!empty($parents))    {
        $term->parents = $parents;
      }
      unset($term->parent);
      $lineages[] = $term;
    } 
    return $lineages;
  }
    
  //Turns the lineage objects into a multi-level array.
  
  private function _process_lineage($lineage) {
  
    // Basic check that we have an object here and not some other data type.
    if (is_object ( $lineage )) {
      $output = array (); // This is what is returned as an array of data that will be themed before rendering as HTML.
      $output []  = $lineage->name.' ('.$lineage->tid.')';
      // $output[$lineage->tid] []  = $lineage->tid;
      // If this term has parents then these are processed using a recursive call.
      if (isset ( $lineage->parents )) {
        foreach ( $lineage->parents as $parent ) {
          $output []  = $this->_process_lineage ( $parent );
        }
      }
      return $output;
    }
  }
  
  private function _array_flatten($array, $return) {
    for($x = 0; $x <= count ( $array ) - 1; $x ++) {
      if (is_array ( $array [$x] )) {
        $return = $this->_array_flatten ( $array [$x], $return );
      } else {
        if ($array [$x]) {
          $return [] = $array [$x];
        }
      }
    }
    return $return;
  }
}

?>
