#testfile for getting a feeling for the api of pychacl
from pyshacl.shapes_graph import ShapesGraph
from pyshacl.rdfutil import (
    clone_blank_node,
    clone_graph,
    compare_blank_node,
    compare_node,
    load_from_source,
    mix_datasets,
    mix_graphs,
    order_graph_literal,
)
import rdflib
import os, sys
from rdflib.namespace import RDF
from rdflib import Graph, BNode, Namespace, URIRef
from pprint import pprint
from SPARQLWrapper import SPARQLWrapper, JSON
from pyshacl.consts import (
    SH,
    OWL_Class,
    OWL_DatatypeProperty,
    RDF_Property,
    RDF_type,
    RDFS_Class,
    RDFS_subClassOf,
    SH_ConstraintComponent,
    SH_datatype,
    SH_node,
    SH_NodeShape,
    SH_path,
    SH_property,
    SH_PropertyShape,
    SH_targetClass,
    SH_targetNode,
    SH_targetObjectsOf,
    SH_targetSubjectsOf,
)

SH_mincount = SH.minCount
SH_maxcount = SH.maxCount
SH_in = SH.term("in")

class ShapesInfoGraph():
    def __init__(self,rdf_graph_file_path):
        shapes_file_raw = open(rdf_graph_file_path,'r') 
        shapes_file = shapes_file_raw.read().replace('\n', '')

        rdf_graph = load_from_source(
                    shapes_file, rdf_format="turtle", multigraph=True, do_owl_imports=False
                )
        assert isinstance(rdf_graph, (rdflib.Dataset, rdflib.ConjunctiveGraph, rdflib.Graph))
        self.sg = rdf_graph
        if isinstance(self.sg, (rdflib.Dataset, rdflib.ConjunctiveGraph)):
            self.sg = next(iter(self.sg.contexts()))
    
    @property
    def node_shapes(self):
        return set(self.sg.subjects(RDF_type,SH_NodeShape))    
    
    @staticmethod
    def object_values(legen):
        leset = set(legen)
        if not leset: 
            return None 
        elif len(leset) == 1: 
            return leset.pop()
        else:
             return leset
    
    def reciproce_nodechecking(self,blindnode, categoricals):
        categoricals = categoricals
        if isinstance(blindnode, (rdflib.term.BNode)):
            blindnode_values = ShapesInfoGraph.object_values(self.sg.objects(blindnode))
            for values in blindnode_values:
                self.reciproce_nodechecking(values, categoricals)
        else:
            categoricals.append(blindnode)
        return categoricals
    
    def get_categories(self,categories, tochecknodes):
        toreturncategories = []
        for i in tochecknodes:
            categories.append(self.reciproce_nodechecking(i, categories)) 
        for x in categories:
            if isinstance(x, (rdflib.term.Literal)):
                toreturncategories.append(x)
        return toreturncategories

    def target_for_shape(self,nodeshape):
        target = self.sg.objects(nodeshape,SH_targetClass)
        return target
    
    def properties_for_shape(self,nodeshape):
        prop_nodes = self.sg.objects(nodeshape,SH_property)
        props_dict = {}
        for prop_node in prop_nodes:
            categoricals = []
            path = ShapesInfoGraph.object_values(self.sg.objects(prop_node,SH_path))
            datatype = ShapesInfoGraph.object_values(self.sg.objects(prop_node,SH_datatype))
            mincount = ShapesInfoGraph.object_values(self.sg.objects(prop_node,SH_mincount))
            maxcount = ShapesInfoGraph.object_values(self.sg.objects(prop_node,SH_maxcount))

            values   = ShapesInfoGraph.object_values(self.sg.objects(prop_node,SH_in))    
            if values is not None: 
                new_vals = ShapesInfoGraph.object_values(self.sg.objects(values)) 
                categoricals =  self.get_categories(categories=categoricals, tochecknodes=new_vals) 
            props_dict[path] = {"type":datatype,"min":mincount,"max":maxcount,"values":categoricals}

        return props_dict
    
    def full_shacl_graph_dict(self):
        tureturn = []
        for nodeshape in self.node_shapes:
            props = self.properties_for_shape(nodeshape)
            tureturn.append(props)
        return tureturn



    