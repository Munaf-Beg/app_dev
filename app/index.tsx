import React, { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View} from 'react-native'
import { Button, PaperProvider, Surface, Text, Searchbar} from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Database, getEventsTotal , getEventsFromDB,FestEvents ,getSavedEvents, toggleSavedEvents} from '../src/data/events';
import { EventCard } from '@/src/components/EventCards';

type SortOption = 'none' | 'day-asc' | 'regs-desc';

export default function App(){
  const CATEGORIES = [ 'Music', 'Tech', 'Dance', 'Misc'];
  const [search,setSearch]=useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<number[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [allEvents, setAllEvents] = useState<FestEvents[]>([]);

  const [isDbReady, setIsDbReady] = useState(false);
  useEffect(() => {
    const loadDB = async () => {
      await Database();
      const count = await getEventsTotal();
      setTotalCount(count);
      const events = await getEventsFromDB();
      setAllEvents(events);
      const initialSavedIds = await getSavedEvents();
      setSavedEventIds(initialSavedIds);
      setIsDbReady(true); 
    };
    loadDB();
  }, []);

  useEffect(() => {
    const loadDB = async () => {
      await Database();
      const count =await getEventsTotal();
      setTotalCount(count);
      const events = await getEventsFromDB();
      setAllEvents(events);
      const initialSavedIds = await getSavedEvents();
      setSavedEventIds(initialSavedIds);
    };
    loadDB();
  }, []);

  const toggleCategory =(category:string) =>{
    if (category==='All'){
      setSelectedCategory([]);
      return;
    }
    else{setSelectedCategory((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );}
  };

   const resetFilters = () => {
    setSearch('');
    setSelectedCategory([]);
    setSortBy('none');
  };

  const toggleSave = async (eventId: number) => {
    if (!isDbReady) return;
    const isCurrentlySaved = savedEventIds.includes(eventId);
    await toggleSavedEvents(eventId, isCurrentlySaved);
    setSavedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }

  const fuse = useMemo(() => {
    return new Fuse(allEvents, {
      keys:['name'],
      threshold:0.3,
      ignoreLocation:true,
    });
  }, [allEvents]);

  const processedEvents = useMemo(() => {
    let result= allEvents;

    if(search.trim() !== ''){
      const searchResult =fuse.search(search);
      result = searchResult.map((r)=>r.item);
    }

    if(selectedCategory.length>0){
      result = result.filter((event) => selectedCategory.includes(event.category));
    }

    if(sortBy==='day-asc'){
      result=[...result].sort((a,b) => a.day-b.day);
    }else if(sortBy==='regs-desc'){
      result=[...result].sort((a,b) => b.registrations-a.registrations);
    }

    const saved = result.filter(event => savedEventIds.includes(event.id));
    const unsaved = result.filter(event => !savedEventIds.includes(event.id));

    return [...saved,...unsaved];
  }, [allEvents, search, selectedCategory, sortBy , savedEventIds]);


  return(
    <PaperProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <Text variant="displayLarge" style={styles.titleText}>Fest Event Explorer</Text>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.totalEvents}>
            <View>
              <Text style={styles.totalEventsText}>Total Events</Text>
              <Text style={styles.totalEventsValue}>{totalCount}</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(72, 229, 194, 0.15)' }]}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#48E5C2" />
          </View>
          </View>
          <View style={styles.topCategory}>
            <View>
              <Text style={styles.topCategoryText}>Top Category</Text>
              <Text style={styles.topCategoryValue}>Music </Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(179, 120, 211, 0.15)' }]}>
              <MaterialCommunityIcons name="music-note" size={28} color="#B378D3" />
            </View>
          </View>  
          <Searchbar                                        
            placeholder="Search for an event..."
            value={search}
            onChangeText={(text) => setSearch(text)} 
            style={styles.searchBarContainer}
            inputStyle={styles.searchInputText}
            placeholderTextColor="#9BA1A6"
            iconColor="#9BA1A6"
          />
          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:15,paddingLeft:20}}>
            <TouchableOpacity
              onPress={() => toggleCategory('All')}
              style={[
                styles.filterChip, 
                selectedCategory.length === 0 && styles.filterChipActive 
              ]}
            >
              <Text style={[
                styles.filterText, 
                selectedCategory.length === 0 && styles.filterTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.includes(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={()=> toggleCategory(cat)}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}>
                    <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                      {cat}
                    </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
            {/*Sort*/}
          <View style={styles.sortContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSortBy('day-asc')}
              style={[styles.sortChip, sortBy === 'day-asc' && styles.sortChipActive]}
            >
              <MaterialCommunityIcons 
                name="calendar-outline" 
                size={14} 
                color={sortBy === 'day-asc' ? "#FFFFFF" : "#48E5C2"}
              />
              <Text style={[styles.sortText, sortBy === 'day-asc' && styles.sortTextActive]}>
                By day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSortBy('regs-desc')}
              style={[styles.sortChip, sortBy === 'regs-desc' && styles.sortChipActive]}
            >
              <MaterialCommunityIcons 
                name="trending-up" 
                size={14} 
                color={sortBy === 'day-asc' ? "#FFFFFF" : "#48E5C2"}
              />
              <Text style={[styles.sortText, sortBy === 'regs-desc' && styles.sortTextActive]}>
                Top Category
              </Text>
            </TouchableOpacity>
            {/*Reset button*/}
            <View style={styles.resetContainer}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*Events*/}
          <View style={styles.eventCardsContainer}>
            {processedEvents.map((event) =>(
              <EventCard
                key={event.id}
                event={event}
                isSelected={savedEventIds.includes(event.id)}
                isFeatured={false}
                onToggle={() => toggleSave(event.id)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#000000",
  },
  titleText:{
    fontSize:50,
    fontWeight:'900',
    color:'#ffffff',
    letterSpacing:-1.5,
    textShadowColor: 'rgba(77, 171, 247, 0.6)', 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginTop:20,
    marginLeft:20,
  },
  scrollContent:{
    alignItems:'center',
    paddingBottom:20,
  },
  totalEvents:{
    marginTop:10,
    borderTopWidth:2,
    borderTopColor:'#108e86',
    borderLeftWidth:5,
    borderLeftColor:'#108e86',
    backgroundColor:'#0b134d',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:16,
    marginLeft:10,
    marginRight:10,
    borderRadius:20,
    height:90,
    width:'90%',
    alignSelf:'center',
  },
  totalEventsText:{
    color: '#8B9298',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  totalEventsValue:{
    paddingRight:10,
    fontWeight:900,
    fontSize:30,
    color:'#ffffff',
    letterSpacing:-1.2,
  },
  topCategory:{
    borderTopWidth:2,
    borderTopColor:'#81108e',
    backgroundColor:'#0b134d',
    borderLeftWidth:5,
    borderLeftColor:'#81108e',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:16,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    borderRadius:20,
    height:90,
    width:'90%',
    alignSelf:'center',
  },
  topCategoryText:{
    color: '#8B9298',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  topCategoryValue:{
    fontWeight:900,
    fontSize:30,
    color:'#ffffff',
    letterSpacing:-1.2,
  },
  iconContainer:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
  },
  searchBarContainer: {
    marginTop:20,
    width:'90%',
    alignSelf:'center',
    backgroundColor: '#1A1C1E', 
    borderRadius: 28, 
    height: 50,        
    borderWidth: 1,     
    borderColor: '#2C2E30',
    shadowColor: "#2a2049",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchInputText: {
    color: '#FFFFFF',     
    fontSize: 16,        
    minHeight: 0,         
  },
  filterText:{
    color:"#9BA1A6",
    fontWeight:"700",
  },
  filterTextActive:{
    color: '#48E5C2',
  },
  filterChip:{
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1C1E',
    borderWidth: 1,
    borderColor: '#2C2E30',
    marginRight: 10,
  },
  filterChipActive:{
    backgroundColor: 'rgba(72, 229, 194, 0.2)',
    borderColor: '#48E5C2',
  },
  sortContainer:{
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: 15,
    width: '90%',         
    alignSelf: 'center',
  },
  sortChip:{
    flexDirection: 'row',
    alignItems: 'center',
    gap:6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1C1E',
    borderColor: '#2C2E30',
    borderWidth: 1,
    marginRight: 10,
  },
  sortChipActive:{
    backgroundColor: 'rgba(72, 229, 194, 0.2)',
    borderColor: '#48E5C2',
  },
  sortText:{
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  sortTextActive:{
    color: '#FFFFFF',
  },
  resetContainer:{
    marginLeft:15,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resetBtn:{
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  resetBtnText:{
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '700',
  },
  eventCardsContainer:{
    width: '100%', 
    marginTop: 20, 
    paddingBottom: 30
  },
});
