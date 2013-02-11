<?php

function unipro_search_views_data() {

  $data['unipro_search']['table']['group'] = t('Unipro Search Logger');

  $data['unipro_search']['table']['base'] = array(
      'field' => 'id',
      'title' => t('Unipro Search'),
      'help' => t('Statistics relating to SOLR search.'),
      'weight' => -10,
  );

  
  // This table references the {user} table. The declaration below creates an
  // 'implicit' relationship to the user table, so that when 'user' is the base
  // table, the fields are automatically available.
  $data['unipro_search']['table']['join'] = array(
      // Index this array by the table name to which this table refers.
      // 'left_field' is the primary key in the referenced table.
      // 'field' is the foreign key in this table.
      'taxonomy_term_data' => array(
          'left_field' => 'tid',
          'field' => 'territory',
      ),
  );
  
  $data['unipro_search']['id'] = array(
      'title' => t('Search ID'),
      'help' => t('Search Log Record Unique ID.'),
      'field' => array(
          'handler' => 'views_handler_field_numeric',
          'click sortable' => TRUE,
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_numeric',
      ),
      'sort' => array(
          'handler' => 'views_handler_sort',
      ),
  );

$data['unipro_search']['userid'] = array(
      'title' => t('UID'),
      'help' => t('The user performing the search.'),
      'field' => array(
          'handler' => 'views_handler_field_numeric',
          'click sortable' => TRUE,
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_numeric',
      ),
      'sort' => array(
          'handler' => 'views_handler_sort',
      ),
 );
  $data['unipro_search']['territory'] = array(
      'title' => t('Territory'),
      'help' => t('The context of the search.'),
      'field' => array(
          'handler' => 'views_handler_field',
          'click sortable' => TRUE, // This is use by the table display plugin.
      ),
      'sort' => array(
          'handler' => 'views_handler_sort',
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_string',
      ),
      'argument' => array(
          'handler' => 'views_handler_argument_string',
      ),
      'relationship' => array(
          'base' => 'taxonomy_term_data', // The name of the table to join with
          'field' => 'tid', // The name of the field to join with
          'handler' => 'views_handler_relationship',
          'label' => t('Territories'),
      ),
  );

  $data['unipro_search']['timestamp'] = array(
      'title' => t('Timestamp field'),
      'help' => t('The time of the search'),
      'field' => array(
          'handler' => 'views_handler_field_date',
          'click sortable' => TRUE,
      ),
      'sort' => array(
          'handler' => 'views_handler_sort_date',
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_date',
      ),
  );

  $data['unipro_search']['searchterm'] = array(
      'title' => t('Search Term'),
      'help' => t('The search term'),
      'field' => array(
          'handler' => 'views_handler_field',
          'click sortable' => TRUE, // This is use by the table display plugin.
      ),
      'sort' => array(
          'handler' => 'views_handler_sort',
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_string',
      ),
      'argument' => array(
          'handler' => 'views_handler_argument_string',
      ),
  );

  $data['unipro_search']['resultcount'] = array(
      'title' => t('Result count'),
      'help' => t('The number of results returned by the search.'),
      'field' => array(
          'handler' => 'views_handler_field_numeric',
          'click sortable' => TRUE,
      ),
      'filter' => array(
          'handler' => 'views_handler_filter_numeric',
      ),
      'sort' => array(
          'handler' => 'views_handler_sort',
      ),
  );

  return $data;
}
