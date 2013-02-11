<?php 
class breadcrumb {
  
  private $crumbs;
  
  public function __construct() {
    $this->crumbs = array();
  }
  
  public function addCrumb($tid) {
    if (!isset( $this->crumbs )) {
      $this->crumbs = array ();
    }
    if (! in_array ( $tid, $this->crumbs )) {
      $this->crumbs [] = $tid;
    }
  }
/**
 * @return the $crumbs
 */
  public function getCrumbs() {
    return $this->crumbs;
  }
  
  public function reset() {
    unset($this->crumbs);
  }

  public function destroyTail($tid) {
    $newTail = array_search($tid, $this->crumbs )+1;
    array_splice($this->crumbs , $newTail);
  }
  
  public function replaceTail($tid) {
    array_splice($this->crumbs, -1);
    $this->crumbs [] = $tid;
  }
  
  
  public function checkTail($tid) {
    if ($this->crumbs[count($this->crumbs)-1] == $tid) {
      return true;
    }
  }
  
  public function generateBreadcrumb($activetail = false, $lineage = false) {   
    $crumbmarkup = array();
    $crumbmarkup [] = l('Home', '<front>' );
    foreach ($this->crumbs as $key => $crumb) {
      $term = taxonomy_term_load($crumb);
      if ($key == 0)  {
        $crumbmarkup [] = '<span class="no-link">' . $term->name . '</span>';
        
      } elseif ((!$activetail) && ($key == (count($this->crumbs)-1))) {
        $crumbmarkup [] = '<span class="no-link">' . $term->name . '</span>';
      } else {
        if($lineage) {
          $crumbmarkup [] = l($term->name, 'taxonomy/term/' . $term->tid .'/li/'.$lineage );
        } else {
          $crumbmarkup [] = l($term->name, 'taxonomy/term/' . $term->tid . '/bc');
        }
      }
    }
    return $crumbmarkup;
  }
  
  public function setBreadcrumb($crumbs){
    $this->reset();
    foreach ($crumbs as $crumb) {
      $this->crumbs [] = $crumb;
    }
  }
}
?>